import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { USERS, updateUser } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import { useUser } from '../components/user-context';
import LoadingError from '../components/LoadingError';
import Card from '../components/Card';
import ProfileForm from '../components/ProfileForm';



const Profile = () => {
  const { user } = useUser();
  const { uid } = useParams();

  const db = firebase.firestore();

  const [userDoc, loading, error] = useDocumentData(
    db.collection(USERS).doc(uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // Check if current user is an admin
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    if (user) {
      db.collection(USERS)
        .doc(user.uid)
        .get()
        .then((currentUser) => setAdminMode(currentUser.data().isAdmin));
    }
  }, []);

  //button to change is Admin
  const handleClick = () => {
    //console.log("click");
    setAdminMode(true)
  }


  return (
    <main>
      <Card>
        <h1 className="text-2xl leading-6 font-medium text-gray-900">
          {`Edit ${userDoc?.uid === user.uid ? 'your' : 'user'} profile`}
        </h1>
      </Card>

      <LoadingError data={userDoc} loading={loading} error={error}>
        {userDoc && (
          <>
            <Card>
              <ProfileForm
                userDoc={userDoc}
                isCurrentUser={userDoc.uid === user.uid}
                adminMode={adminMode}
              />
            </Card>
          </>
        )}
      </LoadingError>

      {/* 
      Modify src/client/pages/Profile.js as follows:

      Add a new section below the </LoadingError>  tag at line 58.
      The section should have a function to update the user's admin status.
      You can modify the UI of the section as per your preference. Make sure the design aligns with the overall aesthetic of the page.
      You may customize the app's UI as desired, although this is not a requirement.
      */}

      {/*Button will change admin status of user*/}
      <button 
        style={{position: "relative", top: "-4.85rem", right: "-56rem"}}
        className="ml-3 inline-flex py-2 px-4 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={handleClick}
        //onClick={() => setAdminMode(true)}
        >
          Bestow admin powers
      </button>


    </main>
  );
};

export default Profile;
