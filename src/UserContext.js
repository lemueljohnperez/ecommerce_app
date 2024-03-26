import React from 'react';

//Create a Context Object

//a context object is a data type of an object that can be used to store information that can be shared to other components within the app
//Allows easier access by avoiding the use of prop-drilling

const UserContext = React.createContext();

//Provider Component
//Allows other components to consume or use the context object and supply the necessary information needed to the context object

export const UserProvider = UserContext.Provider;

export default UserContext;