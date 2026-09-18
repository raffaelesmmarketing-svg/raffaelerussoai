import { NextResponse } from 'next/server'
import { avvisaRichiesta } from '@/lib/avvisi'

// La porta che il database chiama ogni dieci minuti per le richieste rimaste senza avviso.
// Non serve un segreto: l'id è un uuid, e una richiesta già avvisata non viene rimandata.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: Request) {
  const corpo = await req.json().catch(() => null)
  const id = typeof corpo?.id === 'string' ? corpo.id : ''
  if (!UUID.test(id)) return NextResponse.json({ esito: 'id_non_valido' }, { status: 400 })
  const esito = await avvisaRichiesta(id)
  return NextResponse.json({ esito }, { status: esito === 'non_trovata' ? 404 : 200 })
}
