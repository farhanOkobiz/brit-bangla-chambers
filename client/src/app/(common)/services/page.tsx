"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedService } from "@/redux/slices/selectedServiceSlice";
import { useRouter } from "next/navigation";
import { Calendar, Tag, Filter, X, Search } from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";
import Image from "next/image";

interface IServicesDisplay {
  _id: string;
  category?: Category;
  subcategory: Subcategory;
  serviceImage: string;
  title: string;
  description: string;
  created_by: CreatedBy;
  status: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
}

interface CreatedBy {
  _id: string;
  role: string;
  full_name: string;
  email: string;
}

const ServicesDisplay = () => {
  const [services, setServices] = useState<IServicesDisplay[]>([]);
  const [filteredServices, setFilteredServices] = useState<IServicesDisplay[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedServiceModal] =
    useState<IServicesDisplay | null>(null);
  const [showModal, setShowModal] = useState(false);
  const image_url = process.env.NEXT_PUBLIC_IMAGE_URL;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/service/get-all-service");

        const data: IServicesDisplay[] = response.data || []
        const activeServices = data.filter(
          (service: IServicesDisplay) => service.status === "active"
        );
        setServices(activeServices);
        setFilteredServices(activeServices);

        // Extract unique categories and subcategories
        const uniqueCategories = [
          ...new Set(activeServices.map((s) => s.category?.name)),
        ].filter((c): c is string => !!c);
        const uniqueSubcategories = [
          ...new Set(activeServices.map((s) => s.subcategory?.name)),
        ].filter((s): s is string => !!s);
        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
      } catch (err) {
        setError("Failed to fetch services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on selected filters and search term
  useEffect(() => {
    let filtered = services;

    if (selectedCategory) {
      filtered = filtered.filter(
        (service) => service.category?.name === selectedCategory
      );
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(
        (service) => service.subcategory?.name === selectedSubcategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [services, selectedCategory, selectedSubcategory, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSearchTerm("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Group services by category
  const servicesByCategory: Record<string, IServicesDisplay[]> =
    filteredServices.reduce((acc, service) => {
      const categoryName = service.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {} as Record<string, IServicesDisplay[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Services
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Legal Services
            </h1>
            <p className="text-gray-600">
              Professional legal services to meet your needs
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="min-w-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              <div className="min-w-0">
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedSubcategory || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || selectedSubcategory) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    <Filter className="w-3 h-3 mr-1" />
                    {selectedCategory}
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {selectedSubcategory}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Services by Category */}
          {Object.keys(servicesByCategory).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            Object.entries(servicesByCategory).map(
              ([categoryName, categoryServices]) => {
                const servicesArr = categoryServices as IServicesDisplay[];
                return (
                  <div key={categoryName} className="mb-8">
                    {/* Category Header */}
                    <div className="flex items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {categoryName}
                      </h2>
                      <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {servicesArr.length}
                      </span>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {servicesArr.map((service: IServicesDisplay) => (
                        <div
                          key={service._id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 group"
                        >
                          {/* Service Image */}
                          <div className="relative h-32 overflow-hidden">
                            <Image
                              src={`${image_url}${service.serviceImage}`}
                              alt={service.title}
                              fill
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                                {service.subcategory?.name}
                              </span>
                            </div>
                          </div>

                          {/* Service Content */}
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {service.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(service.created_at)}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedServiceModal(service);
                                    setShowModal(true);
                                  }}
                                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    dispatch(
                                      setSelectedService({
                                        id: service._id,
                                        name: service.title,
                                        serviceImage: service.serviceImage,
                                      })
                                    );
                                    localStorage.setItem(
                                      "selectedService",
                                      JSON.stringify({
                                        id: service._id,
                                        name: service.title,
                                        serviceImage: service.serviceImage,
                                      })
                                    );
                                    router.push("/request-for-service");
                                  }}
                                  className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-100 transition-colors cursor-pointer"
                                >
                                  Request This Service
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
      {/* modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 h-full bg-black/40 backdrop-blur-3xl flex items-center justify-center z-50 p-6 md:p-10">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <X className=" w-6 h-6 md:w-8 md:h-8 cursor-pointer" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {selectedService?.title}
            </h2>
            <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
              <Image
                src={`${image_url}${selectedService?.serviceImage}`}
                alt={selectedService?.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong>{" "}
              {selectedService?.category?.name || "N/A"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Subcategory:</strong>{" "}
              {selectedService?.subcategory?.name || "N/A"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Description:</strong> {selectedService?.description}
            </p>
            <div className="text-sm text-gray-500">
              Created on: {formatDate(selectedService?.created_at)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesDisplay;
