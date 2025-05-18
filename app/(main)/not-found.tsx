import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-20 text-center">
            <div className="space-y-4 max-w-md px-4">
                <h1 className="text-8xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold">Страница не найдена</h2>
                <p className="text-muted-foreground">
                    К сожалению, страница, которую вы ищете, не существует или была перемещена.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">
                        Вернуться на главную страницу
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default NotFound;