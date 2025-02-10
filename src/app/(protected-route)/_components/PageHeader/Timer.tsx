'use client';

import {useQueryClient} from '@tanstack/react-query';
import {format} from 'date-fns';
import {RotateCw} from 'lucide-react';
import {useEffect, useState} from 'react';

type Props = {
  keyCache?: string;
};

const Timer = ({keyCache}: Props) => {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  return (
    <>
      <button
        className="group hidden w-fit items-center gap-2 text-sm font-semibold xl:flex"
        onClick={async () => {
          keyCache &&
            (await queryClient.refetchQueries({
              queryKey: [keyCache],
            }));
        }}>
        Data Refresh
        <RotateCw size={16} className="group-hover:animate-spin" />
      </button>
      <div
        className="flex h-11 items-center justify-center rounded-md border border-foreground-200 px-9 text-sm font-bold lg:w-[310px]"
        suppressHydrationWarning>
        {format(currentTime, 'MMMM d, yyyy HH')}
        <span className="animate-pulse">:</span>
        {format(currentTime, 'mm:ss a')}
      </div>
    </>
  );
};

export default Timer;
