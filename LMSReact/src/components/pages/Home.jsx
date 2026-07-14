import Header from '../sections/Header'
import Hero from '../sections/Hero'
import Courses from '../sections/Courses'
import WhyUs from '../sections/WhyUs'
import Footer from '../sections/Footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-sf-bg font-sans text-sf-text">
      <Header />
      <Hero />
      <Courses />
      <WhyUs />
      <Footer />
    </main>
  )
}
