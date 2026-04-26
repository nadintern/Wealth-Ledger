"use client"

import {Provider} from "react-redux";
import {store} from "@/features";
import React from "react";


/**
 * This means that the features that we created is accessible by all the componenets no matter where they are in the tree
 * The reason behind useClient is to tell Next.js that this will be acting like features in client side since Next defualts to server side
 *
 */
export function Providers({children}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>{children}</Provider>
    );
}