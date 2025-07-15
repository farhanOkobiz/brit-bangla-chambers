import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative">
        <div className="container px-4 py-24 sm:px-6 sm:py-32 lg:px-8 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Transform Your Business with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {" "}
                Expert Consulting
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Brit Chamber It delivers strategic consulting solutions that drive growth, optimize operations, and unlock
              your business potential. Partner with us to achieve extraordinary results.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-black bg-transparent"
              >
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/contact">Schedule Free Consultation</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
                <dt className="text-sm leading-6 text-gray-300">Projects Completed</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white flex items-center">
                  <Award className="h-8 w-8 mr-2 text-purple-400" />
                  150+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
                <dt className="text-sm leading-6 text-gray-300">Happy Clients</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white flex items-center">
                  <Users className="h-8 w-8 mr-2 text-purple-400" />
                  200+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
                <dt className="text-sm leading-6 text-gray-300">Growth Achieved</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white flex items-center">
                  <TrendingUp className="h-8 w-8 mr-2 text-purple-400" />
                  300%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
