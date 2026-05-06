import { Suspense } from "react"
import SearchWebClient from "../search_web/SearchWebClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <SearchWebClient />
    </Suspense>
  )
}