"use client";

import {useEffect} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "@/features";
import {fetchCryptoPrices} from "@/features/portfolio/thunks/cryptoThunk";
import {fetchRatesThunk} from "@/features/multi-currency-converter/thunks/fetchRatesThunk";

export function usePricePolling(intervalMs: number = 60_000) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const id = setInterval(() => {
            dispatch(fetchCryptoPrices());
            dispatch(fetchRatesThunk());
        }, intervalMs);
        return () => clearInterval(id);
    }, [dispatch, intervalMs]);
}
