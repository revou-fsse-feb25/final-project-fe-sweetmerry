import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { servicesApi, bookingsApi } from '../utils/api'

const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    notes: ''
  })

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await servicesApi.getById(id)
      setService(response.data.service)
    } catch (err) {
      setError('Failed to load service details')
      console.error('Error fetching service:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } })
      return
    }

    try {
      setBookingLoading(true)
      const bookingData = {
        serviceId: id,
        date: bookingForm.date,
        time: bookingForm.time,
        notes: bookingForm.notes
      }

      await bookingsApi.create(bookingData)
      
      // Reset form
      setBookingForm({
        date: '',
        time: '',
        notes: ''
      })
      
      // Show success message and redirect
      alert('Booking created successfully!')
      navigate('/bookings')
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking'
      alert(errorMessage)
    } finally {
      setBookingLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : ''}`
    }
    return `${mins} minute${mins > 1 ? 's' : ''}`
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Service not found'}</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate('/services')}
                className="hover:text-blue-600"
              >
                Services
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{service.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {service.image && (
              <div className="mb-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.isActive ? 'CONFIRMED' : 'CANCELLED')}`}>
                  {service.isActive ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-sm text-gray-500">
                  Duration: {formatDuration(service.duration)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>

              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(service.price)}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Details</h3>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Category:</dt>
                    <dd className="font-medium">{service.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Duration:</dt>
                    <dd className="font-medium">{formatDuration(service.duration)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Price:</dt>
                    <dd className="font-medium">{formatPrice(service.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status:</dt>
                    <dd className="font-medium">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.isActive ? 'CONFIRMED' : 'CANCELLED')}`}>
                        {service.isActive ? 'Available' : 'Unavailable'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Service</h2>
            
            {!service.isActive ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">🚫</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Unavailable</h3>
                <p className="text-gray-600">This service is currently not available for booking.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={bookingForm.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a time</option>
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

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    placeholder="Any special requirements or notes..."
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Service:</dt>
                      <dd className="font-medium">{service.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Duration:</dt>
                      <dd className="font-medium">{formatDuration(service.duration)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Price:</dt>
                      <dd className="font-medium">{formatPrice(service.price)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !user}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    bookingLoading || !user
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Booking...
                    </span>
                  ) : !user ? (
                    'Please Login to Book'
                  ) : (
                    'Book Now'
                  )}
                </button>

                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    You need to be logged in to make a booking.{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { from: `/services/${id}` } })}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Login here
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail
