import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart as ChartBarIcon, 
  LocalFireDepartment as FireIcon, 
  Stars as SparklesIcon,
  FlashOn as LightningBoltIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Landing.css';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description, delay }) => (
  <motion.div 
    className="modern-feature-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div 
      className="feature-icon-wrapper"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      {icon}
    </motion.div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);

const Landing: React.FC = () => {
  return (
    <div className="modern-landing-container">
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Push <motion.span 
              className="highlight"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >Beyond</motion.span> Your Limits
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Intelligent tracking. Personalized guidance. Real results.
          </motion.p>
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/signup" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Sign In</Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="fitness-mockup"></div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <FeatureCard 
            icon={<ChartBarIcon />}
            title="Smart Analytics"
            description="Comprehensive progress tracking with intuitive visualizations"
            delay={0.2}
          />
          <FeatureCard 
            icon={<FireIcon />}
            title="Custom Workouts"
            description="AI-powered exercise plans tailored to your goals"
            delay={0.4}
          />
          <FeatureCard 
            icon={<SparklesIcon />}
            title="Nutrition Insights"
            description="Intelligent meal planning and macro tracking"
            delay={0.6}
          />
          <FeatureCard 
            icon={<LightningBoltIcon />}
            title="Performance Optimization"
            description="Data-driven recommendations to maximize your potential"
            delay={0.8}
          />
        </div>
      </section>

      <motion.section 
        className="testimonial-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="testimonial-content">
          <blockquote>
            "Beyond isn't just an app, it's a game-changer for my fitness routine."
            <cite>— Sarah Thompson, Professional Athlete</cite>
          </blockquote>
        </div>
      </motion.section>

      <motion.section 
        className="final-cta-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="cta-content">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Fitness, Reimagined
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the fitness revolution. No excuses, just results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/signup" className="cta-button primary large">Start Your Transformation</Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;