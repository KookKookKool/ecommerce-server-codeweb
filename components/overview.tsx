"use client"

import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
interface OverviewProps {
    data: any[];
}
const Overview = ({data}: OverviewProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
        <BarChart data={data}>
            <XAxis 
            dataKey={"name"}
            stroke="#8884d8"
             fontSize={12}
             tickLine={false}
             axisLine={false}
            />

<YAxis 
            stroke="#8884d8"
             fontSize={12}
             tickLine={false}
             axisLine={false}
             tickFormatter={value => `${value}`}
            />

            <Bar dataKey={"total"} fill="#888" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default Overview;