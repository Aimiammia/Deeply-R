
'use client';

import type { FinancialAsset } from '@/types';
import { AssetItem } from './AssetItem';
import { Building } from 'lucide-react';

interface AssetListProps {
  assets: FinancialAsset[];
  onDeleteAsset: (id: string) => void;
  onEditAsset: (asset: FinancialAsset) => void;
  onSetEditingAsset: (asset: FinancialAsset | null) => void; // To control visibility of CreateAssetForm in edit mode
}

export function AssetList({ assets, onDeleteAsset, onEditAsset, onSetEditingAsset }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <Building className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز دارایی‌ای ثبت نشده است.</p>
        <p>اولین دارایی خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedAssets = [...assets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">لیست دارایی‌های شما</h3>
      <ul className="space-y-4">
        {sortedAssets.map((asset) => (
          <AssetItem
            key={asset.id}
            asset={asset}
            onDeleteAsset={onDeleteAsset}
            onEditAsset={() => {
                onEditAsset(asset); // This might not be directly used if onSetEditingAsset shows the form
                onSetEditingAsset(asset);
            }}
          />
        ))}
      </ul>
    </div>
  );
}
