'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import toast from 'react-hot-toast';

interface Address {
    id: string;
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    county: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            recipientName: 'John Doe',
            phone: '+254712345678',
            street: '123 Main Street, Apt 4B',
            city: 'Nairobi',
            county: 'Nairobi',
            isDefault: true,
        },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>({
        recipientName: '',
        phone: '',
        street: '',
        city: '',
        county: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Update existing address
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === editingId ? { ...addr, ...formData } : addr
                )
            );
            toast.success('Address updated successfully');
            setEditingId(null);
        } else {
            // Add new address
            const newAddress: Address = {
                id: Date.now().toString(),
                ...formData,
                isDefault: addresses.length === 0,
            };
            setAddresses((prev) => [...prev, newAddress]);
            toast.success('Address added successfully');
        }

        // Reset form
        setFormData({
            recipientName: '',
            phone: '',
            street: '',
            city: '',
            county: '',
        });
        setIsAdding(false);
    };

    const handleEdit = (address: Address) => {
        setFormData({
            recipientName: address.recipientName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            county: address.county,
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            toast.success('Address deleted');
        }
    };

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
        toast.success('Default address updated');
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            recipientName: '',
            phone: '',
            street: '',
            city: '',
            county: '',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
                        Delivery Addresses
                    </h1>
                    <p className="text-text-secondary">
                        Manage your saved delivery addresses
                    </p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-text-primary mb-1 block">
                                        Recipient Name
                                    </label>
                                    <Input
                                        value={formData.recipientName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, recipientName: e.target.value })
                                        }
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-primary mb-1 block">
                                        Phone Number
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        placeholder="+254712345678"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-text-primary mb-1 block">
                                    Street Address
                                </label>
                                <Input
                                    value={formData.street}
                                    onChange={(e) =>
                                        setFormData({ ...formData, street: e.target.value })
                                    }
                                    placeholder="123 Main Street, Apt 4B"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-text-primary mb-1 block">
                                        City
                                    </label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                        placeholder="Nairobi"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-text-primary mb-1 block">
                                        County
                                    </label>
                                    <Input
                                        value={formData.county}
                                        onChange={(e) =>
                                            setFormData({ ...formData, county: e.target.value })
                                        }
                                        placeholder="Nairobi"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Addresses List */}
            {addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="No addresses saved"
                    description="Add a delivery address to make checkout faster"
                    action={{
                        label: 'Add Address',
                        onClick: () => setIsAdding(true),
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <Card
                            key={address.id}
                            className={`relative ${address.isDefault ? 'border-primary' : ''
                                }`}
                        >
                            <CardContent className="p-6">
                                {address.isDefault && (
                                    <Badge className="absolute top-4 right-4">Default</Badge>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1">
                                                {address.recipientName}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {address.phone}
                                            </p>
                                            <p className="text-sm text-text-secondary mt-2">
                                                {address.street}
                                                <br />
                                                {address.city}, {address.county}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-primary/10">
                                        {!address.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(address.id)}
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Set Default
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                            className="text-error hover:text-error"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <Card className="border-primary/20 bg-background/50">
                <CardContent className="p-6">
                    <h3 className="font-semibold text-text-primary mb-2">
                        💡 Quick Tip
                    </h3>
                    <p className="text-sm text-text-secondary">
                        Set a default address to speed up checkout. You can add multiple
                        addresses and choose which one to use during checkout.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
