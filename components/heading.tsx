"use client"

interface HeadingProps {
    title: string
    description: string
}

export const Heading = ({ title, description } : HeadingProps) => {
  return (
    <div className="w-full">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
    </div>
  )
}
