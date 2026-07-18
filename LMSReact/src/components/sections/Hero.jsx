import { Link } from 'react-router-dom'
import GradientBar from '../shared/GradientBar'
import Button from '../shared/Button'

export default function Hero() {
  return (
    <section className="border-b border-sf-divider bg-sf-secondary-bg">
      <GradientBar />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-8 py-24 max-md:px-4 max-md:py-16">
        <span className="text-[10px] font-bold tracking-[1px] text-sf-primary">
          LEARNING MANAGEMENT SYSTEM
        </span>
        <h1 className="m-0 max-w-3xl text-[64px] font-black leading-[1.05] max-md:text-[40px]">
          LEARN WITHOUT LIMITS WITH DIBIEDU
        </h1>
        <p className="max-w-2xl text-base text-sf-secondary-text">
          A modern academic platform built for students and educators. Access
          courses, track progress, and grow your skills all in one place.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="primary" size="large">
              START LEARNING
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="large">
              EXPLORE COURSES
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
