import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer'; 


const MainLayout = () => {
  return (
    
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      
      <Header 
        showProfile={true} 
        showBackButton={false} 
      />


      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> 
      </main>

      
      <Footer />
    </div>
  );
};

export default MainLayout;