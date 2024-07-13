'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/step1');
  }, []);

  return null; // o cualquier otro contenido que desees mostrar brevemente antes de redirigir
}

export default Home;