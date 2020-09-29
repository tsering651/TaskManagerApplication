import firebase from "../../firebaseConfig";
import "firebase/firestore";
import { Alert } from "react-native";

export const checkIfLoggedIn = (navigation) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            navigation.navigate("Task Monitor");
        }
    });
};

export const loginUser = async (email, password) => {
    try {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                Alert.alert(error.message);
            });
    } catch (error) {
        console.log(error.toString());
    }
};

export const signupUser = async (email, password) => {
    try {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                const userUid = firebase.auth().currentUser.uid;

                firebase.firestore().collection("users").doc(userUid).set({
                    userUid: userUid,
                    userEmail: email,
                });
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    } catch (error) {
        console.log(error.toString());
    }
};

export const logout = async (navigation) => {
    await firebase.auth().signOut();
    navigation.navigate("Login");
};

export const addTask = async (
    navigation,
    taskTitle,
    taskTime,
    taskContent,
    priorityIs,
    isCompleted = false,
    isUpdated = false
) => {
    const timeStamp = firebase.firestore.Timestamp.fromDate(new Date());

    await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("tasks")
        .add({
            userId: firebase.auth().currentUser.uid,
            taskTitle: taskTitle,
            taskTime: taskTime,
            taskContent: taskContent,
            createdAt: timeStamp,
            priorityIs: priorityIs,
            isCompleted: isCompleted,
            isUpdated: isUpdated,
        })
        .catch((error) => console.log(error));

    navigation.navigate("Your Tasks");
};

export const updateTask = async (
    navigation,
    id,
    taskTitle,
    taskTime,
    taskContent,
    taskPriority,
    isChecked
) => {
    const timeStamp = firebase.firestore.Timestamp.fromDate(new Date());

    await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("tasks")
        .doc(id)
        .update({
            userId: firebase.auth().currentUser.uid,
            taskTitle: taskTitle,
            taskTime: taskTime,
            taskContent: taskContent,
            createdAt: timeStamp,
            priorityIs: taskPriority,
            isCompleted: isChecked,
            isUpdated: true,
        })
        .catch((error) => console.log(error));

    navigation.navigate("Your Tasks");
};

export const deleteTask = async (navigation, id) => {
    await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("tasks")
        .doc(id)
        .delete();

    navigation.navigate("Your Tasks");
};

export const updateIsCompleted = async (isCompleted, taskId) => {
    const dbRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("tasks");

    dbRef.doc(taskId).update({ isCompleted: !isCompleted });
};

export const deleteUser = async (navigation) => {
    const user = firebase.auth().currentUser;

    await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .delete();

    user.delete()
        .then(function () {
            logout(navigation);
        })
        .catch(function (error) {
            Alert.alert(error.message);
        });
};

// export const deleteAllTasks = async () => {
//     await firebase
//         .firestore()
//         .collection("users")
//         .doc(firebase.auth().currentUser.uid)
//         .collection("tasks")
// };
