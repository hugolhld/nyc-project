"use client";

import { io } from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}`);