import { OverlayPanel } from 'primereact/overlaypanel'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import type { Root, TableData } from '@/types/data'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator } from 'primereact/paginator'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react'
import type { SelectionRequest } from '@/routes'

interface TableProps {
  queryData: Root
  page: number
  handlePageChange: (pageNo: number) => void
  setSelectionRequest: Dispatch<SetStateAction<SelectionRequest | null>>
  selectionRequest: SelectionRequest | null
}

export const Table = ({
  queryData,
  handlePageChange,
  page,
  selectionRequest,
  setSelectionRequest,
}: TableProps) => {
  const data = useMemo(() => queryData.data, [])

  const opRef = useRef<OverlayPanel>(null)
  const [selectedRows, setSelectedRows] = useState<TableData[]>([])
  const [inputValue, setInputValue] = useState<number | null>(null)

  useEffect(() => {
    if (!selectionRequest?.startPage || selectionRequest.startPage > page) {
      setSelectedRows([])
      return
    }

    const limit = queryData.pagination.limit
    const { startPage, count } = selectionRequest
    const noOfFieldsInbetween = count - (page - startPage) * limit

    noOfFieldsInbetween > 0
      ? setSelectedRows(data.slice(0, noOfFieldsInbetween))
      : setSelectedRows([])
  }, [page, data, selectionRequest])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue) return

    setSelectionRequest({
      startPage: page,
      count: inputValue,
    })

    opRef.current?.hide()
  }

  return (
    <div className="m-6">
      <DataTable
        value={data}
        stripedRows
        scrollable
        selectionMode={'checkbox'}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        scrollHeight="70vh"
        showGridlines
        className="min-w-full"
      >
        <Column
          selectionMode="multiple"
          bodyStyle={{}}
          header={
            <div className="flex items-center gap-1">
              <i
                onClick={(e) => {
                  // console.log('OverlayPanel Ref:', opRef)
                  opRef.current?.toggle(e)
                }}
                className="pi pi-chevron-down text-sm text-gray-500 cursor-pointer mr-1"
              />
            </div>
          }
          headerStyle={{ width: '3rem' }}
        />
        <Column
          field="title"
          header="Title"
          style={{ padding: '4px', minWidth: '200px' }}
        />
        <Column
          field="place_of_origin"
          header="Place Of Origin"
          style={{ padding: '4px', minWidth: '120px' }}
        />
        <Column
          field="artist_display"
          header="Artist Display"
          body={(row) => (
            <a
              href={row.api_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-words"
            >
              {row.api_link}
            </a>
          )}
          style={{ padding: '4px', minWidth: '250px' }}
        />
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ padding: '4px', minWidth: '100px' }}
        />
        <Column
          field="date_start"
          header="Date Start"
          style={{ padding: '4px', minWidth: '100px' }}
        />
        <Column
          field="date_end"
          header="Date End"
          style={{ padding: '4px', minWidth: '100px' }}
        />
      </DataTable>

      <div className="p-4 flex justify-center border-t border-gray-200">
        <Paginator
          first={(page - 1) * queryData.pagination.limit}
          rows={queryData.pagination.limit}
          totalRecords={queryData.pagination.total}
          onPageChange={(e) => handlePageChange(e.page + 1)}
          template="PrevPageLink PageLinks NextPageLink"
          className="paginator"
        />
      </div>

      <OverlayPanel ref={opRef} dismissable>
        <form className="p-2" onSubmit={(e) => handleSubmit(e)}>
          <InputNumber
            value={inputValue}
            required
            min={0}
            onValueChange={(e) => setInputValue(e.target.value!)}
            placeholder="Enter number"
            className="m-1 p-1 border-2 rounded-sm"
          />
          <div className="flex justify-end gap-2 p-1">
            <Button
              label="Submit"
              icon="pi pi-check"
              className="p-button-sm p-button-success bg-sky-100 hover:bg-sky-200 transition-all py-1 px-2 rounded-sm gap-2"
            />
            <Button
              label="Close"
              icon="pi pi-times"
              className="p-button-sm p-button-secondary bg-sky-100 hover:bg-sky-200 transition-all py-1 px-2 rounded-sm gap-2"
              onClick={() => opRef.current?.hide()}
            />
          </div>
        </form>
      </OverlayPanel>
    </div>
  )
}
