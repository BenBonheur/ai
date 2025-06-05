"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, MapPin } from "lucide-react"

export default function ParkingLotsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock parking lot data
  const parkingLots = [
    {
      id: 1,
      name: "Kigali Heights Parking",
      location: "KG 7 Ave, Kigali",
      totalSlots: 120,
      availableSlots: 45,
      pricePerHour: 500,
      isActive: true,
      owner: "Kigali Heights Ltd",
    },
    {
      id: 2,
      name: "Kigali Convention Center",
      location: "KG 2 Roundabout, Kimihurura",
      totalSlots: 200,
      availableSlots: 78,
      pricePerHour: 800,
      isActive: true,
      owner: "Rwanda Convention Bureau",
    },
    {
      id: 3,
      name: "Nyamirambo Stadium",
      location: "Nyamirambo, Kigali",
      totalSlots: 80,
      availableSlots: 12,
      pricePerHour: 300,
      isActive: true,
      owner: "City of Kigali",
    },
    {
      id: 4,
      name: "Remera Shopping Mall",
      location: "KK 15 Rd, Remera",
      totalSlots: 60,
      availableSlots: 22,
      pricePerHour: 400,
      isActive: true,
      owner: "Remera Investments Ltd",
    },
    {
      id: 5,
      name: "Kimironko Market",
      location: "KG 11 Ave, Kimironko",
      totalSlots: 40,
      availableSlots: 5,
      pricePerHour: 200,
      isActive: false,
      owner: "Market Association",
    },
  ]

  const filteredParkingLots = parkingLots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parking Lots</h2>
          <p className="text-muted-foreground">Manage all parking locations across Rwanda</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Parking Lot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parking Lots</CardTitle>
          <CardDescription>A list of all parking lots in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parking lots..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Total Slots</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-right">Price/Hour</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParkingLots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {lot.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{lot.totalSlots}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-medium ${lot.availableSlots < 10 ? "text-red-500" : lot.availableSlots < 30 ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {lot.availableSlots}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">RWF {lot.pricePerHour}</TableCell>
                    <TableCell className="text-center">
                      {lot.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          {lot.isActive ? (
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredParkingLots.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No parking lots found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
