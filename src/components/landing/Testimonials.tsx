
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      avatar: "https://i.pravatar.cc/150?img=1",
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Datafield Technologies",
      content: "CareerVision helped me identify skills gaps that were holding back my career progression. Within 6 months of following their recommendations, I secured a senior role with a 30% salary increase.",
      rating: 5
    },
    {
      avatar: "https://i.pravatar.cc/150?img=2",
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Global Brands Inc.",
      content: "The market trend analysis was eye-opening. I was able to pivot my focus to emerging areas in digital marketing before they became mainstream, positioning me as an expert in my company.",
      rating: 5
    },
    {
      avatar: "https://i.pravatar.cc/150?img=3",
      name: "Emma Rodriguez",
      role: "Data Scientist",
      company: "AnalyticsPro",
      content: "As someone transitioning careers, CareerVision was invaluable in helping me understand which of my transferable skills were most valuable and what new skills to prioritize learning.",
      rating: 4
    },
    {
      avatar: "https://i.pravatar.cc/150?img=4",
      name: "David Washington",
      role: "Product Manager",
      company: "Innovations LLC",
      content: "The personalized career path mapping gave me clarity on my next steps. I've recommended CareerVision to everyone in my professional network.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="py-24 bg-gradient-to-b from-muted/30 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            See how professionals across industries have transformed their careers with data-driven insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-0"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-careervision-500/10 to-insight-500/10 rounded-bl-full"></div>
              <CardContent className="p-8">
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-4 items-center">
                      <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-md">
                        <img src={testimonial.avatar} alt={testimonial.name} />
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <blockquote className="text-lg italic">"{testimonial.content}"</blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
