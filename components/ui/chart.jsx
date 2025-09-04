"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const ResponsiveContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full h-[350px]", className)}>
    <div className="w-full h-full">
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%" {...props} />
    </div>
  </div>
))
ResponsiveContainer.displayName = "ResponsiveContainer"

const LineChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.LineChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
LineChart.displayName = "LineChart"

const BarChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.BarChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
BarChart.displayName = "BarChart"

const PieChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.PieChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
PieChart.displayName = "PieChart"

const AreaChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.AreaChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
AreaChart.displayName = "AreaChart"

const ComposedChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.ComposedChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
ComposedChart.displayName = "ComposedChart"

const RadarChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.RadarChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
RadarChart.displayName = "RadarChart"

const ScatterChart = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.ScatterChart data={data} {...props} />
    </ResponsiveContainer>
  )
})
ScatterChart.displayName = "ScatterChart"

const Treemap = React.forwardRef(({ className, data, ...props }, ref) => {
  return (
    <ResponsiveContainer ref={ref} className={className}>
      <RechartsPrimitive.Treemap data={data} {...props} />
    </ResponsiveContainer>
  )
})
Treemap.displayName = "Treemap"

export {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ComposedChart,
  RadarChart,
  ScatterChart,
  Treemap,
  RechartsPrimitive,
}
