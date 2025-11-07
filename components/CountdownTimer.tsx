"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

interface CountdownTimerProps {
  deadline: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ deadline, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Calcular inmediatamente
    const time = calculateTimeLeft();
    setTimeLeft(time);

    // Actualizar cada segundo
    const interval = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (isExpired) {
    return (
      <div className={`bg-red-50 border-2 border-red-200 rounded-lg p-4 sm:p-6 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-red-700">
          <Clock className="w-5 h-5" />
          <p className="font-semibold text-sm sm:text-base">
            La fecha límite para confirmar ha expirado
          </p>
        </div>
        <p className="text-center text-xs sm:text-sm text-red-600 mt-2">
          Por favor contacta a los novios directamente
        </p>
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className={`bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-2 border-pink-200 rounded-lg p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-pink-600" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-700">
          Confirma tu asistencia antes de:
        </h3>
      </div>
      
      <div className="text-center text-xs sm:text-sm text-gray-600 mb-4">
        {new Date(deadline).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {/* Días */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-lg w-full aspect-square flex items-center justify-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-bold">{formatNumber(timeLeft.days)}</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2">Días</span>
        </div>

        {/* Horas */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg w-full aspect-square flex items-center justify-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-bold">{formatNumber(timeLeft.hours)}</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2">Horas</span>
        </div>

        {/* Minutos */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-lg w-full aspect-square flex items-center justify-center shadow-lg">
            <span className="text-2xl sm:text-4xl font-bold">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2">Min</span>
        </div>

        {/* Segundos */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg w-full aspect-square flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl sm:text-4xl font-bold">{formatNumber(timeLeft.seconds)}</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2">Seg</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          ⏰ El contador se actualiza en tiempo real
        </p>
      </div>
    </div>
  );
}
