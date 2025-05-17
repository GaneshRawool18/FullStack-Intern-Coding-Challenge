import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      
      <style jsx="true">{`
        .main-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--lightest-gray);
        }
        
        .main-content {
          flex: 1;
          padding-bottom: 2rem;
        }
        
        /* Container styles for different sections */
        :global(.container-narrow) {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        :global(.section) {
          padding: 4rem 0;
        }
        
        :global(.section-heading) {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        :global(.section-title) {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          position: relative;
        }
        
        :global(.section-title:after) {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -15px;
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          transform: translateX(-50%);
          border-radius: 50px;
        }
        
        :global(.card) {
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        :global(.card:hover) {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          :global(.section) {
            padding: 2rem 0;
          }
          
          :global(.section-title) {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout; 