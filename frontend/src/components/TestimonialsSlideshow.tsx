import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Testimonial {
  name: string;
  role: string;
  specialty: string;
  image: string;
  rating: number;
  review: string;
}

interface TestimonialsSlideshowProps {
  darkMode: boolean;
}

export function TestimonialsSlideshow({ darkMode }: TestimonialsSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials: Testimonial[] = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Cardiologist',
      specialty: 'Johns Hopkins Hospital',
      image: 'https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjMyNzE0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 5,
      review: 'This platform has revolutionized how I document patient encounters. What used to take 20 minutes now takes less than 5. The AI accuracy is phenomenal, and I can spend more quality time with my patients instead of being buried in paperwork.',
    },
    {
      name: 'Dr. James Patterson',
      role: 'Emergency Medicine Physician',
      specialty: 'Massachusetts General Hospital',
      image: 'https://images.unsplash.com/photo-1632054224659-280be3239aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MzIyNzczNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 5,
      review: 'In the fast-paced ER environment, speed and accuracy are critical. Secure Medical Notes AI captures every detail flawlessly while I focus on saving lives. The HIPAA compliance gives me complete peace of mind. Absolutely game-changing!',
    },
    {
      name: 'Nurse Jennifer Lopez, RN',
      role: 'Pediatric Care Coordinator',
      specialty: 'Children\'s Hospital Los Angeles',
      image: 'https://images.unsplash.com/photo-1562673462-877b3612cbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMGhlYWx0aGNhcmUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMjcxNDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 5,
      review: 'As a pediatric nurse, documentation accuracy is crucial for our young patients. This AI system understands medical terminology perfectly and integrates seamlessly with our EHR. It\'s like having an intelligent assistant who never makes mistakes.',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Psychiatrist & Mental Health Director',
      specialty: 'Stanford Medical Center',
      image: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdCUyMG1lZGljYWx8ZW58MXx8fHwxNzYzMjcxNDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 5,
      review: 'Psychiatric notes require nuance and sensitivity. This platform captures the complexity of mental health consultations with remarkable precision. My documentation quality has improved significantly, and I\'ve reduced burnout from administrative tasks.',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Orthopedic Surgeon',
      specialty: 'Mayo Clinic',
      image: 'https://images.unsplash.com/photo-1762190102324-116a615896da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJnZW9uJTIwbWVkaWNhbCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjMyMjk0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 5,
      review: 'Between surgeries and consultations, my schedule is packed. This AI tool has given me back hours each week. The specialty-specific templates for orthopedics are incredibly thorough, and the security standards exceed our hospital requirements.',
    },
  ];

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];
  
  const cardBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700/50'
    : 'bg-white/50 border-white/60';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="relative py-20 px-6 overflow-hidden">
      {/* Background Elements */}
      {!darkMode && <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>}

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className={`inline-block px-4 py-2 ${
            darkMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'bg-indigo-100 text-indigo-700'
          } rounded-full text-sm mb-4`}>
            What Healthcare Professionals Say
          </div>
          <h2 className={`text-5xl ${textClass} mb-4`}>
            Trusted by Medical Experts
          </h2>
          <p className={`text-xl ${textSecondaryClass} max-w-2xl mx-auto`}>
            Join thousands of doctors and nurses who have transformed their clinical documentation workflow
          </p>
        </motion.div>

        {/* Testimonial Slideshow */}
        <div className={`relative ${cardBgClass} backdrop-blur-xl rounded-[3rem] p-12 md:p-16 border shadow-2xl`}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              {/* Left: Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-xl border-4 border-white/80">
                    <ImageWithFallback
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Quote Icon */}
                  <div className="absolute -bottom-4 -right-4 p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Right: Review Content */}
              <div className="flex-1 space-y-6">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className={`text-lg md:text-xl ${textSecondaryClass} leading-relaxed italic`}>
                  "{currentTestimonial.review}"
                </p>

                {/* Reviewer Info */}
                <div className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h4 className={`text-xl ${textClass}`}>
                    {currentTestimonial.name}
                  </h4>
                  <p className={textSecondaryClass}>{currentTestimonial.role}</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{currentTestimonial.specialty}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className={`p-3 ${
                darkMode ? 'bg-slate-700/80 border-slate-600/60 hover:bg-slate-700' : 'bg-white/80 border-white/60 hover:bg-white'
              } backdrop-blur-sm rounded-xl shadow-lg border transition-colors`}
            >
              <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className={`p-3 ${
                darkMode ? 'bg-slate-700/80 border-slate-600/60 hover:bg-slate-700' : 'bg-white/80 border-white/60 hover:bg-white'
              } backdrop-blur-sm rounded-xl shadow-lg border transition-colors`}
            >
              <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} />
            </motion.button>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-purple-600 to-indigo-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
