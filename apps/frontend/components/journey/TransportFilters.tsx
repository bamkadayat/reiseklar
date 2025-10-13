'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Train, Bus, Ship, Plane, Check, Cable, type LucideIcon } from 'lucide-react';

interface TransportFiltersProps {
  selectedModes: string[];
  onModeChange: (modes: string[]) => void;
}

interface TransportMode {
  id: string;
  label: string;
  icon: LucideIcon;
}

const transportModes: TransportMode[] = [
  { id: 'train', label: 'Train', icon: Train },
  { id: 'metro', label: 'Metro', icon: Train },
  { id: 'tram', label: 'Tram', icon: Cable },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'expressbus', label: 'Express bus', icon: Bus },
  { id: 'ferry', label: 'Boat', icon: Ship },
  { id: 'water', label: 'Car ferry', icon: Ship },
  { id: 'airporttrain', label: 'Airport train', icon: Train },
  { id: 'airportbus', label: 'Airport bus', icon: Bus },
  { id: 'plane', label: 'Plane', icon: Plane },
];

export function TransportFilters({ selectedModes, onModeChange }: TransportFiltersProps) {
  const t = useTranslations('journey.filters');

  const toggleMode = (modeId: string) => {
    if (selectedModes.includes(modeId)) {
      onModeChange(selectedModes.filter(m => m !== modeId));
    } else {
      onModeChange([...selectedModes, modeId]);
    }
  };

  const selectAll = () => {
    onModeChange(transportModes.map(m => m.id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How do you prefer to travel?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Public transport / Alternatives toggle */}
        <div className="flex gap-2">
          <Button
            variant={selectedModes.length > 0 ? 'default' : 'outline'}
            className="flex-1"
            onClick={selectAll}
          >
            Public transport
          </Button>
          <Button variant="outline" className="flex-1">
            Alternatives
          </Button>
        </div>

        {/* All modes button */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={selectAll}
        >
          All
        </Button>

        {/* Individual mode filters */}
        <div className="space-y-2">
          {transportModes.map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = selectedModes.includes(mode.id);

            if (!IconComponent) {
              console.error(`Icon undefined for mode: ${mode.id}`);
              return null;
            }

            return (
              <button
                key={mode.id}
                onClick={() => toggleMode(mode.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Other travel options */}
        <div className="pt-4 border-t">
          <button className="w-full text-left font-medium text-gray-900 flex items-center justify-between py-2">
            Other travel options
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
