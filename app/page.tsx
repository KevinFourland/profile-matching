"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => router.push("/"));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      {/* Hero Section */}
      <section className="max-w-3xl text-center space-y-4">
        <h1 className="text-5xl font-extrabold leading-tight">PlayerMatch</h1>
        <p className="text-lg text-muted-foreground">
          Sistem Profile Matching untuk perekrutan pemain baru yang objektif dan akurat.
        </p>
        <div className="space-x-4">
          {status === "authenticated" ? (
            // <Button variant="outline" onClick={handleSignOut}>
            //   Sign Out
            // </Button>
            <Button variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : status === "loading" ? (
            <Button variant="outline" disabled>
              Loading...
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Features Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎯 Scoring Cerdas</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Input data pemain, sistem menilai berdasarkan kriteria core & secondary.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📊 Ranking Otomatis</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Hasil ranking yang terstruktur membantu keputusan perekrutan.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🔒 Akses Aman</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Login dengan autentikasi dan kontrol akses berbasis peran.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-10" />

      {/* How It Works Section */}
      <section className="max-w-4xl w-full space-y-6">
        <h2 className="text-2xl font-semibold text-center">Cara Kerja</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Input Data Pemain',
              desc: 'Isi form dengan detail pemain seperti nama, posisi, dan statistik.',
            },
            {
              step: '02',
              title: 'Proses Scoring',
              desc: 'Sistem menghitung skor berdasarkan metode Profile Matching.',
            },
            {
              step: '03',
              title: 'Lihat Hasil Ranking',
              desc: 'Periksa halaman ranking untuk melihat daftar pemain terbaik.',
            },
          ].map((item) => (
            <Card key={item.step} className="border-2 border-transparent hover:border-primary transition">
              <CardContent className="flex flex-col items-center space-y-4 text-center">
                <Badge variant="outline" className="text-xl font-bold p-3 rounded-full">
                  {item.step}
                </Badge>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <CheckCircle className="w-6 h-6 text-primary" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Footer */}
      <footer className="w-full text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SkillMatch. All rights reserved.
      </footer>
    </main>
  );
}
