import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import {
  PRIMARY,
  FOURTH,
  BLUE_SHADE,
  SECONDARY,
  THIRD,
} from "../../../../../../styles/global";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DocumentPicker from "react-native-document-picker";
import storage from "@react-native-firebase/storage";
import moment from "moment";
import ActionProgressComponent from "../../../../../../utilities/ActionProgressComponent";

const HealthRecords = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [fetchedAllDocs, setFetchedAllDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchUser = async () => {
    const user = auth().currentUser;

    if (user) {
      // User is signed in, find the document from firestore.
      firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((docSnap) => {
          setUserDetails({
            uid: user.uid,
            ...docSnap.data(),
          });
        });
    } else {
      // No user is signed in. redirect to login.
      // console.log("No user is currently signed in");
      router.replace("/Login");
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      // Doc size > 5 MB dont upload
      if (doc.size / 1000 / 1000 > 5) {
        Alert.alert(
          "Document size too large.",
          "Please ensure document size is less than 5 MB."
        );
        return;
      }

      setUploading(true);
      const blobFile = await uriToBlob(doc.uri);

      const ref = storage().ref();
      // folderName/time_fileName.extension
      const folderName = userDetails.uid + "/";
      const fileName = new Date().getTime() + "_" + doc.name;
      const snapshot = ref.child(folderName + fileName).put(blobFile);
      snapshot.on("state_changed", (taskSnapshot) => {
        const progressPercent =
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        setProgress(progressPercent.toFixed(0));
      });

      snapshot.then(async () => {
        // add filename to array of document objects.
        firestore()
          .collection("users")
          .doc(userDetails.uid)
          .update({
            documents: firestore.FieldValue.arrayUnion(fileName),
          })
          .then(() => {
            setUploading(false);
            // reset progress to 0
            setProgress(0);
          });
        blobFile.close();
      });
    } catch (err) {
      // user didn't select a file is an error.
      // console.log(err);
      setUploading(false);
      // reset progress to 0
      setProgress(0);
    }
  };

  const fetchDocs = async () => {
    if (!userDetails.documents) {
      setFetchedAllDocs(true);
      return;
    }
    const filenames = userDetails.documents;
    const fetchPromises = filenames.map((filename) =>
      storage()
        .ref(userDetails.uid + "/" + filename) // reference the folder/filename
        .getMetadata()
        .then((metadata) => {
          return metadata;
        })
    );

    // Step 2: Use Promise.all to wait for all fetches to complete
    Promise.all(fetchPromises)
      .then((fetchedDocuments) => {
        const validDocuments = fetchedDocuments
          // sort based on time uploaded
          .sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));

        // Update state with fetched documents
        setDocuments(validDocuments);
        // make loading false to display all the fetched documents at once.
        setFetchedAllDocs(true);
      })
      .catch((error) => {
        setFetchedAllDocs(true);
        console.error("Error fetching documents:", error);
      });
  };

  const deleteDoc = async (filename) => {
    let onlyFilename = getFilename(filename);
    Alert.alert(
      "Confirm deletion?",
      `Are you sure you want to delete the file ${onlyFilename}`,
      [
        {
          text: "Delete",
          onPress: () => {
            setDeleting(true);
            const folderName = userDetails.uid + "/";
            const fileRef = storage().ref(folderName + filename);
            fileRef
              .delete()
              .then(async () => {
                // File deleted successfully
                // also remove the file name from user's documents field in firestore.
                firestore()
                  .collection("users")
                  .doc(userDetails.uid)
                  .update({
                    documents: firestore.FieldValue.arrayRemove(filename),
                  })
                  .then(() => {
                    setDeleting(false);
                  });
              })
              .catch(function (error) {
                // Some Error occurred
                setDeleting(false);
                console.log(error);
              });
          },
        },
        { text: "Cancel", onPress: () => {} },
      ]
    );
  };

  const getFilename = (filename) => {
    return filename.substring(filename.indexOf("_") + 1);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userDetails) {
      fetchDocs();
    }
  }, [userDetails]);

  return (
    <View contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      {/* If loading is true or user has not been fetched, show the activity indicator */}
      {!userDetails || !fetchedAllDocs ? (
        <ActivityIndicator size={"large"} color={PRIMARY} style={{ flex: 1 }} />
      ) : (
        <>
          {uploading && (
            <ActionProgressComponent action={"upload"} progress={progress} />
          )}
          {deleting && <ActionProgressComponent action={"delete"} />}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <View style={styles.outerContainer}>
              {documents.length > 0 ? (
                <View style={styles.container}>
                  {documents.map((doc) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.documentContainer}
                      key={doc.name}
                      onPress={() =>
                        router.push(`dashboard/profile/ehr/pdfView/${doc.name}`)
                      }
                    >
                      <View style={styles.docPreview}>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          activeOpacity={0.5}
                          onPress={() => deleteDoc(doc.name)}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={18}
                            color={"#eb2f45"}
                          />
                        </TouchableOpacity>
                        <MaterialCommunityIcons
                          name="file-pdf-box"
                          size={72}
                          color={"#888"}
                        />
                      </View>
                      <View style={styles.fileDetails}>
                        <Text
                          numberOfLines={1}
                          style={[styles.text, styles.filename]}
                        >
                          {getFilename(doc.name)}
                        </Text>
                      </View>
                      <Text style={[styles.text, styles.dateCreated]}>
                        Uploaded on:{" "}
                        {moment(doc.timeCreated).format("DD/MM/YYYY")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noDocumentContainer}>
                  <MaterialCommunityIcons
                    name="folder-open"
                    size={128}
                    color={THIRD}
                  />
                  <Text style={[styles.text, styles.noDocumentText]}>
                    Currently you have no documents added
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.absoluteBtn}
              onPress={selectDoc}
            >
              <Ionicons
                name="cloud-upload-sharp"
                size={24}
                color={BLUE_SHADE}
              />
              <Text style={[styles.text, styles.btnText]}>Upload</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default HealthRecords;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: FOURTH,
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontFamily: "Inter_400Regular",
  },
  documentContainer: {
    width: Dimensions.get("window").width / 2 - 25,
    marginVertical: 10,
  },
  docPreview: {
    height: 100,
    backgroundColor: "#d9d9d9",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
  },
  fileDetails: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 1,
  },
  filename: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  dateCreated: {
    fontSize: 12,
    padding: 5,
    color: SECONDARY,
  },
  absoluteBtn: {
    position: "absolute",
    right: 15,
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 2,
  },
  btnText: {
    marginLeft: 10,
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: "white",
  },
  noDocumentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDocumentText: {
    color: SECONDARY,
    fontFamily: "Inter_500Medium",
  },
});
