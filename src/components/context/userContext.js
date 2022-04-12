import React, { useEffect, useState } from 'react';
import { app } from '../firebase/firebase';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const userContext = React.createContext();


const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState({
    prevChannel: "",
    currentChannel: "Sohbet"
  });

  console.log(channel)

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const signInWithFirebase = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        handleLogin({
          name: result._tokenResponse.fullName,
          photo: result._tokenResponse.photoUrl,
          email: result._tokenResponse.email,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setUser({});
  };

  const handleLogin = (user) => {
    if (user.name && user.photo) {
      setIsLoggedIn(true);
      setUser(user);
    }
  };

  return (
    <userContext.Provider
      value={{
        user,
        signInWithFirebase,
        isLoggedIn,
        handleLogout,
        isLoading,
        messages,
        channels,
        setChannels,
        channel,
        setChannel
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
