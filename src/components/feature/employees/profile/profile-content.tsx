"use client";

import { startTransition, useState } from "react";
import { Camera, Pencil, X, Check, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  RoleBadge,
  EmployeeStatusBadge,
} from "@/components/shared/status-badge";
import type { Employee } from "@/lib/api/employee/employee.type";
import { signOut } from "next-auth/react";
import { updateMe } from "@/lib/actions/employee/employee-action";

// ── Types ────────────────────────────────────────────────────────────────────
type Props = {
  employee: Employee;
};

type EditForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

// ── Component ────────────────────────────────────────────────────────────────
export default function ProfileContent({ employee }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phoneNumber: employee.phoneNumber,
    address: employee.address,
  });

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    // [API] PATCH /employees/me/avatar (multipart/form-data)
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updateMe(form);
      if (res.success) {
        setIsEditing(false);
      }
    });
  }

  function handleCancel() {
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
    });
    setIsEditing(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">โปรไฟล์</h1>
          <p className="text-sm text-muted-foreground">ข้อมูลส่วนตัว</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} />
            แก้ไข
          </Button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={avatarPreview ?? employee.avatarUrl ?? undefined}
            />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/80 transition-colors"
          >
            <Camera size={14} />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <RoleBadge role={employee.role} />
            <EmployeeStatusBadge status={employee.status} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Info / Edit form */}
      {isEditing ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">แก้ไขข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ชื่อ</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>นามสกุล</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>เบอร์โทร</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                placeholder="08x-xxx-xxxx"
              />
            </div>
            <div className="space-y-1.5">
              <Label>ที่อยู่</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ที่อยู่ปัจจุบัน"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 gap-1.5" onClick={handleSave}>
                <Check size={15} />
                บันทึก
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={handleCancel}
              >
                <X size={15} />
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="space-y-0">
              {[
                { label: "อีเมล", value: employee.email },
                { label: "เบอร์โทร", value: employee.phoneNumber },
                { label: "ที่อยู่", value: employee.address },
                {
                  label: "เลขบัตรประชาชน",
                  value: String(employee.identificationId),
                },
                {
                  label: "ค่าแรงรายวัน",
                  value: employee.dailyRate
                    ? `฿${employee.dailyRate.toLocaleString()}/วัน`
                    : "-",
                },
                {
                  label: "เบี้ยเลี้ยง",
                  value: employee.allowancePerDay
                    ? `฿${employee.allowancePerDay.toLocaleString()}/วัน`
                    : "-",
                },
                {
                  label: "วันที่เข้าทำงาน",
                  value: new Date(employee.createdAt).toLocaleDateString(
                    "th-TH",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  ),
                },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex justify-between items-start py-3 gap-4">
                    <span className="text-sm text-muted-foreground shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-right">
                      {row.value}
                    </span>
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-muted rounded-lg transition-colors"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  );
}
