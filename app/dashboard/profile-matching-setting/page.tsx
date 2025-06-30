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
    const [weightCore, setWeightCore] = useState(0.6);
    const [weightSecondary, setWeightSecondary] = useState(0.4);
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
                        setWeightCore(json.data.weightCore);
                        setWeightSecondary(json.data.weightSecondary);
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
        const payload = { coreFactors: core, secondaryFactors: secondary, weightCore, weightSecondary };
        const res = await fetch('/api/settings/profile-matching', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
            router.refresh();
            // optionally show toast
        } else {
            // optionally show error toast
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
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
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium">
                                Weight Core: {weightCore.toFixed(2)}
                            </Label>
                            <Slider
                                value={[weightCore]}
                                min={0}
                                max={1}
                                step={0.05}
                                onValueChange={v => setWeightCore(v[0])}
                            />
                        </div>
                        <div>
                            <Label className="block text-sm font-medium">
                                Weight Secondary: {weightSecondary.toFixed(2)}
                            </Label>
                            <Slider
                                value={[weightSecondary]}
                                min={0}
                                max={1}
                                step={0.05}
                                onValueChange={v => setWeightSecondary(v[0])}
                            />
                        </div>
                    </div>

                    {/* Save with confirmation dialog */}
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
