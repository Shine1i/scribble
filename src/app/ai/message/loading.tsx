import { motion } from "framer-motion";

export function LoadingContent() {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    start: { scaleX: 0, opacity: 0 },
    end: { scaleX: 1, opacity: 1 },
  };

  const lineTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      <motion.div className="flex space-x-2">
        <motion.div
          className="h-4 bg-muted rounded w-[75px]"
          variants={lineVariants}
          transition={lineTransition}
        />
        <motion.div
          className="h-4 bg-muted rounded w-[100px]"
          variants={lineVariants}
          transition={lineTransition}
        />
      </motion.div>
      <motion.div
        className="h-4 bg-muted rounded w-[225px]"
        variants={lineVariants}
        transition={lineTransition}
      />
      <motion.div
        className="h-4 bg-muted rounded w-[150px]"
        variants={lineVariants}
        transition={lineTransition}
      />
    </motion.div>
  );
}
