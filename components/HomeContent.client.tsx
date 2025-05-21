'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Memecoin } from '@/lib/memecoin.types';
import MemecoinItem from '@/components/memecoins/MemecoinItem.client';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomeContent({ memecoins, isLoggedIn = false, userName = "" }: { memecoins: Memecoin[], isLoggedIn?: boolean, userName?: string }) {
  return (
    <div className="flex flex-col gap-8">
      <motion.section 
        className="py-16 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Bienvenue sur Memecoin Explorer
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground mb-10 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Découvrez, suivez et créez des memecoins sur notre plateforme
        </motion.p>
        <motion.div 
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
            <Link href="/memecoins">Explorer les Memecoins</Link>
          </Button>
        </motion.div>
      </motion.section>

      {isLoggedIn && (
        <motion.section 
          className="py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div>
              <motion.h2 
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                Bienvenue {userName ? `${userName}` : ''} sur votre espace personnel
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                Suivez vos memecoins préférés et gérez votre portefeuille en temps réel
              </motion.p>
            </div>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="default" className="flex items-center gap-2">
                  <Link href="/portfolio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Mon Portfolio
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link href="/memecoins">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Trader
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}

      <motion.section 
        className="py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6"
          variants={item}
          initial="hidden"
          animate="show"
        >
          Memecoins populaires
        </motion.h2>
        <motion.div 
          className="grid sm:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {memecoins.map(coin => (
            <motion.div key={coin.id} variants={item}>
              <MemecoinItem coin={coin} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-6 text-center"
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
        >
          <Button variant="outline" asChild>
            <Link href="/memecoins">Voir tous les memecoins</Link>
          </Button>
        </motion.div>
      </motion.section>

      <motion.section 
        className="py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Qu&apos;est-ce qu&apos;un Memecoin?
        </motion.h2>
        <motion.p 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          Les memecoins sont des cryptomonnaies inspirées par des mèmes internet, des blagues ou des
          phénomènes culturels.
          Contrairement aux cryptomonnaies traditionnelles, elles sont souvent créées pour le divertissement
          plutôt que pour une utilité spécifique.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          Sur Memecoin Explorer, vous pouvez suivre les dernières tendances, créer vos propres memecoins et
          participer à cette communauté dynamique.
        </motion.p>
      </motion.section>

      {!isLoggedIn && (
        <motion.section 
          className="py-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <motion.h2 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            Commencez dès aujourd&apos;hui
          </motion.h2>
          <motion.p 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            Rejoignez notre communauté et découvrez le monde fascinant des memecoins. Créez votre compte pour commencer à trader et suivre vos memecoins préférés.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.4 }}
          >
            <div>
              <Button 
                asChild 
                size="lg"
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 border-0 shadow-lg"
              >
                <Link href="/register" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="16" x2="22" y1="11" y2="11" />
                  </svg>
                  Créer un compte
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.section>
      )}
    </div>
  );
}
