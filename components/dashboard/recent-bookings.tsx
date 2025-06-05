import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentBookingsProps {
  isLoading: boolean
}

export function RecentBookings({ isLoading }: RecentBookingsProps) {
  const bookings = [
    {
      id: "B-1234",
      user: {
        name: "Jean Mutoni",
        email: "jean@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      parkingLot: "Kigali Heights Parking",
      startTime: "Today, 10:00 AM",
      endTime: "Today, 2:00 PM",
      status: "in_use",
    },
    {
      id: "B-1235",
      user: {
        name: "Eric Mugisha",
        email: "eric@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      parkingLot: "Kigali Convention Center",
      startTime: "Today, 9:30 AM",
      endTime: "Today, 5:00 PM",
      status: "booked",
    },
    {
      id: "B-1236",
      user: {
        name: "Alice Uwase",
        email: "alice@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      parkingLot: "Nyamirambo Stadium",
      startTime: "Yesterday, 2:00 PM",
      endTime: "Yesterday, 6:00 PM",
      status: "completed",
    },
    {
      id: "B-1237",
      user: {
        name: "Robert Keza",
        email: "robert@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      parkingLot: "Remera Shopping Mall",
      startTime: "Today, 8:00 AM",
      endTime: "Today, 10:00 AM",
      status: "cancelled",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
            Booked
          </Badge>
        )
      case "in_use":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
            In Use
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-50">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={booking.user.avatar || "/placeholder.svg"} />
            <AvatarFallback>{booking.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.user.name}</p>
            <p className="text-xs text-muted-foreground">{booking.parkingLot}</p>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>
          <div>{getStatusBadge(booking.status)}</div>
        </div>
      ))}
    </div>
  )
}
