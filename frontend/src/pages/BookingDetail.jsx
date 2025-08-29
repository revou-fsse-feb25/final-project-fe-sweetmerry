import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { bookingsApi } from '../utils/api'

const BookingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    notes: ''
  })

  useEffect(() => {
    fetchBooking()
  }, [id])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const response = await bookingsApi.getById(id)
      setBooking(response.data.booking)
      
      // Initialize edit form
      setEditForm({
        date: response.data.booking.date.split('T')[0],
        time: response.data.booking.time,
        notes: response.data.booking.notes || ''
      })
    } catch (err) {
      setError('Failed to load booking details')
      console.error('Error fetching booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBooking = async (e) => {
    e.preventDefault()
    
    try {
      setUpdateLoading(true)
      const updateData = {
        date: editForm.date,
        time: editForm.time,
        notes: editForm.notes
      }

      await bookingsApi.update(id, updateData)
      
      // Refresh booking data
      await fetchBooking()
      setEditing(false)
      alert('Booking updated successfully!')
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update booking'
      alert(errorMessage)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) {
      return
    }

    try {
      await bookingsApi.update(id, { status: newStatus })
      await fetchBooking()
      alert('Booking status updated successfully!')
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update booking status'
      alert(errorMessage)
    }
  }

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await bookingsApi.update(id, { status: 'CANCELLED' })
      await fetchBooking()
      alert('Booking cancelled successfully!')
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to cancel booking'
      alert(errorMessage)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳'
      case 'CONFIRMED': return '✅'
      case 'COMPLETED': return '🎉'
      case 'CANCELLED': return '❌'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Booking not found'}</p>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate('/bookings')}
                className="hover:text-blue-600"
              >
                Bookings
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">Booking Details</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.id}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                <span className="mr-1">{getStatusIcon(booking.status)}</span>
                {booking.status}
              </span>
            </div>
          </div>

          {/* Service Info */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-sm">Service Name:</span>
                <p className="font-medium">{booking.service.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Category:</span>
                <p className="font-medium">{booking.service.category}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Price:</span>
                <p className="font-medium">{formatPrice(booking.service.price)}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Duration:</span>
                <p className="font-medium">{booking.service.duration} minutes</p>
              </div>
            </div>
            {booking.service.description && (
              <div className="mt-4">
                <span className="text-gray-500 text-sm">Description:</span>
                <p className="text-gray-700 mt-1">{booking.service.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Booking Information</h2>
            {!editing && (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Booking
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={editForm.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <select
                    name="time"
                    required
                    value={editForm.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={editForm.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-sm">Date:</span>
                <p className="font-medium">{formatDate(booking.date)}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Time:</span>
                <p className="font-medium">{formatTime(booking.time)}</p>
              </div>
              {booking.notes && (
                <div className="md:col-span-2">
                  <span className="text-gray-500 text-sm">Notes:</span>
                  <p className="text-gray-700 mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm">Name:</span>
              <p className="font-medium">{booking.user.name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email:</span>
              <p className="font-medium">{booking.user.email}</p>
            </div>
            {booking.user.phone && (
              <div>
                <span className="text-gray-500 text-sm">Phone:</span>
                <p className="font-medium">{booking.user.phone}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500 text-sm">Booking Created:</span>
              <p className="font-medium">{formatDate(booking.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-2">
            {/* Admin Actions */}
            {isAdmin && booking.status === 'PENDING' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('CONFIRMED')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              </>
            )}

            {isAdmin && booking.status === 'CONFIRMED' && (
              <button
                onClick={() => handleStatusUpdate('COMPLETED')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Mark as Completed
              </button>
            )}

            {/* User Actions */}
            {!isAdmin && (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
              <button
                onClick={handleCancelBooking}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel My Booking
              </button>
            )}

            <button
              onClick={() => navigate('/bookings')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetail
