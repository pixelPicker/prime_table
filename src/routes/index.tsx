import { useData } from '@/api/hooks/useData'
import { Table } from '@/components/Table'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MoonLoader } from 'react-spinners'

export const Route = createFileRoute('/')({
  component: App,
})

export type SelectionRequest = {
  startPage: number
  count: number
}

function App() {
  const [page, setPage] = useState(1)

  const [selectionRequest, setSelectionRequest] =
    useState<SelectionRequest | null>(null)
  const { data, error, isLoading } = useData(page)

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  if (isLoading) {
    return (
      <div className="p-2 border-2 border-sky-50 flex justify-center items-center flex-col gap-4 rounded-full">
        <MoonLoader />
        <p>Wait while we are fetching...</p>
      </div>
    )
  }
  if (error || !data) {
    return (
      <div className="p-6 border-[1.5px] border-sky-300">
        <img
          src="https://img.freepik.com/free-vector/magnifying-glass-with-warning_78370-6943.jpg"
          className="max-w-48 aspect-square object-cover"
        />
        <p>Failed to fetch data. Please try again</p>
      </div>
    )
  }
  return (
    <>
      <Table
        queryData={data}
        page={page}
        handlePageChange={(number) => handlePageChange(number)}
        selectionRequest={selectionRequest}
        setSelectionRequest={setSelectionRequest}
      />
    </>
  )
}
