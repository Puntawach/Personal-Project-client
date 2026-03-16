import CreateEmployeeForm from '@/components/feature/employees/create-employee-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateEmployeePage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Employee</CardTitle>
          <CardDescription>Add a new employee to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateEmployeeForm />
        </CardContent>
      </Card>
    </div>
  )
}
