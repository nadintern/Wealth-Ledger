"use client";

import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
import type {ReactNode} from "react";
import type {AllocationSlice} from "@/features/dashboard/selectors/dashboardSelectors";

interface AllocationDonutProps {
    slices: AllocationSlice[];
    children?: ReactNode;
}

export default function AllocationDonut({slices, children}: AllocationDonutProps) {
    return (
        <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={slices}
                        dataKey="value"
                        nameKey="label"
                        innerRadius="70%"
                        outerRadius="100%"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={true}
                    >
                        {slices.map((s) => (
                            <Cell key={s.key} fill={s.color}/>
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {children}
            </div>
        </div>
    );
}
