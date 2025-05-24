import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/box';
import HomeScreenCategories from '@/components/home-screen-categories-container';
import { HomeSearchContainer } from '@/components/home-search-components';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import HeroSection from '../_components/hero-section';
import LogoTicker from '../_components/LogoTicker';
import Features from '../_components/features-section';
import Faqs from '../_components/Faqs';

const homeDashboard = async () => {

    const {userId} = await auth();
    const jobs = await getJobs({})

    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });

    const companies = await db.company.findMany({
        orderBy: { createdAt : "desc" },
    });

  return (
    <div className='flex-col py-6 px-4 space-y-24'> 
    <HeroSection />
    <HomeScreenCategories categories={categories}/>
    <LogoTicker />
    <Features />
    <Faqs />

    </div>
  )
}

export default homeDashboard