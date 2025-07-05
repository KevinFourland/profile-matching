'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type FactorKey =
    | 'winRate'
    | 'kda'
    | 'rank'
    | 'tournamentCertificate'
    | 'tournamentExperienceCount';

const ALL_FACTORS: FactorKey[] = [
    'winRate',
    'kda',
    'rank',
    'tournamentCertificate',
    'tournamentExperienceCount',
];

export default function ProfileMatchingSettingsPage() {
    const [core, setCore] = useState<FactorKey[]>([]);
    const [secondary, setSecondary] = useState<FactorKey[]>([]);
    // sliderValue represents the Core percentage (0-1)
    const [sliderValue, setSliderValue] = useState(0.6);
    const [openConfirm, setOpenConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        try {
            fetch('/api/settings/profile-matching')
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        setCore(json.data.coreFactors);
                        setSecondary(json.data.secondaryFactors);
                        // initialize slider from saved weightCore
                        setSliderValue(json.data.weightCore);
                    }
                })
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    }, []);

    function toggleFactor(f: FactorKey, isCore: boolean) {
        if (isCore) {
            setCore(c => (c.includes(f) ? c.filter(x => x !== f) : [...c, f]));
            setSecondary(s => s.filter(x => x !== f));
        } else {
            setSecondary(s => (s.includes(f) ? s.filter(x => x !== f) : [...s, f]));
            setCore(c => c.filter(x => x !== f));
        }
    }

    async function handleSave() {
        setOpenConfirm(false);
        const payload = {
            coreFactors: core,
            secondaryFactors: secondary,
            weightCore: sliderValue,
            weightSecondary: 1 - sliderValue,
        };
        const res = await fetch('/api/settings/profile-matching', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
            router.refresh();
        } else {
            console.error('Failed to save settings');
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Profile Matching Setting</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configure Profile Matching</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 text-sm font-medium">Core Factors</Label>
                            {ALL_FACTORS.map(f => (
                                <div key={f} className="flex items-center space-x-2 mb-1">
                                    <Checkbox
                                        checked={core.includes(f)}
                                        onCheckedChange={() => toggleFactor(f, true)}
                                    />
                                    <span className="text-sm capitalize">{f}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label className="mb-2 text-sm font-medium">Secondary Factors</Label>
                            {ALL_FACTORS.map(f => (
                                <div key={f} className="flex items-center space-x-2 mb-1">
                                    <Checkbox
                                        checked={secondary.includes(f)}
                                        onCheckedChange={() => toggleFactor(f, false)}
                                    />
                                    <span className="text-sm capitalize">{f}</span>
                                </div>
                            ))}
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Core: {(sliderValue * 100).toFixed(0)}%</span>
                                <span>Secondary: {((1 - sliderValue) * 100).toFixed(0)}%</span>
                            </div>
                            <Slider
                                value={[sliderValue]}
                                min={0}
                                max={1}
                                step={0.01}
                                onValueChange={([v]) => setSliderValue(v)}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>⟵ 100% Secondary</span>
                                <span>100% Core ⟶</span>
                            </div>
                        </div>
                    </div>

                    {/* Single slider for core vs secondary */}

                    <div className="text-right">
                        <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
                            <AlertDialogTrigger asChild>
                                <Button onClick={() => setOpenConfirm(true)}>Save Settings</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
