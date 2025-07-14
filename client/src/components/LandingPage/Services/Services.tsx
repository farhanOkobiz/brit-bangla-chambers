import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Settings, Users, BarChart3, Lightbulb, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: 1,
    title: "Strategic Planning & Analysis",
    description:
      "Comprehensive strategic planning services to define your business direction, identify opportunities, and create actionable roadmaps for sustainable growth.",
    icon: TrendingUp,
    features: ["Market Analysis", "Competitive Intelligence", "Growth Strategy", "Risk Assessment"],
    duration: "4-8 weeks",
    price: "Starting from $5,000",
    featured: true,
  },
  {
    id: 2,
    title: "Digital Transformation",
    description:
      "End-to-end digital transformation consulting to modernize your operations, enhance customer experience, and drive innovation.",
    icon: Settings,
    features: ["Technology Assessment", "Process Digitization", "Change Management", "Training & Support"],
    duration: "8-16 weeks",
    price: "Starting from $10,000",
    featured: true,
  },
  {
    id: 3,
    title: "Organizational Development",
    description:
      "Build high-performing teams and optimize organizational structure to improve efficiency, culture, and employee engagement.",
    icon: Users,
    features: ["Team Building", "Leadership Development", "Culture Transformation", "Performance Management"],
    duration: "6-12 weeks",
    price: "Starting from $7,500",
    featured: false,
  },
  {
    id: 4,
    title: "Business Process Optimization",
    description:
      "Streamline operations, eliminate inefficiencies, and implement best practices to reduce costs and improve productivity.",
    icon: BarChart3,
    features: ["Process Mapping", "Workflow Optimization", "Automation Solutions", "Quality Improvement"],
    duration: "4-10 weeks",
    price: "Starting from $6,000",
    featured: false,
  },
  {
    id: 5,
    title: "Innovation & Product Development",
    description:
      "Drive innovation initiatives, develop new products/services, and create competitive advantages in your market.",
    icon: Lightbulb,
    features: ["Innovation Strategy", "Product Roadmap", "Market Validation", "Launch Planning"],
    duration: "6-14 weeks",
    price: "Starting from $8,500",
    featured: false,
  },
  {
    id: 6,
    title: "Risk Management & Compliance",
    description:
      "Identify, assess, and mitigate business risks while ensuring regulatory compliance and building resilient operations.",
    icon: Shield,
    features: ["Risk Assessment", "Compliance Audit", "Policy Development", "Crisis Management"],
    duration: "3-8 weeks",
    price: "Starting from $4,500",
    featured: false,
  },
]

export function Services() {
  const featuredServices = services.filter((service) => service.featured)
  const otherServices = services.filter((service) => !service.featured)

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Consulting Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive consulting solutions tailored to your business needs. From strategy to implementation, we`&apos;`re
            your trusted partner for growth.
          </p>
        </div>

        {/* Featured Services */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Featured Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredServices.map((service) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={service.id}
                  className="relative overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                >
                  <Badge className="absolute top-4 right-4 bg-purple-600">Featured</Badge>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{service.description}</p>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Duration: {service.duration}</span>
                      <span className="font-medium text-purple-600">{service.price}</span>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/services/${service.id}`}>
                        Book Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Other Services */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {otherServices.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-sm">{service.description}</p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{service.duration}</span>
                      <span className="font-medium text-gray-700">{service.price}</span>
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/services/${service.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
