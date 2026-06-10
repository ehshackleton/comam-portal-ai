import { NextResponse } from 'next/server';
import { conferenceRegistrations, db, registrationStatusHistory } from '@comam/db';

const PARTICIPANT_TYPES = ['delegate', 'observer', 'speaker', 'organizer', 'guest'] as const;

type RegistrationBody = {
  fullName?: string;
  email?: string;
  country?: string;
  city?: string;
  participantType?: string;
  attendanceMode?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  imageAuthorization?: boolean;
  institutionName?: string;
  delegation?: string;
};

export async function POST(request: Request) {
  if (process.env.REGISTRATION_ENABLED !== 'true') {
    return NextResponse.json({ error: 'El registro no está habilitado.' }, { status: 403 });
  }

  let body: RegistrationBody;
  try {
    body = (await request.json()) as RegistrationBody;
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim().toLowerCase();
  const participantType = body.participantType?.trim();

  if (!fullName || !email || !participantType) {
    return NextResponse.json({ error: 'Nombre, email y tipo de participante son requeridos.' }, { status: 400 });
  }

  if (!PARTICIPANT_TYPES.includes(participantType as (typeof PARTICIPANT_TYPES)[number])) {
    return NextResponse.json({ error: 'Tipo de participante inválido.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const [created] = await db
    .insert(conferenceRegistrations)
    .values({
      fullName,
      email,
      country: body.country?.trim() || null,
      city: body.city?.trim() || null,
      participantType,
      status: 'submitted',
      attendanceMode: body.attendanceMode?.trim() || null,
      dietaryRestrictions: body.dietaryRestrictions?.trim() || null,
      accessibilityNeeds: body.accessibilityNeeds?.trim() || null,
      imageAuthorization: body.imageAuthorization === true,
      institutionalData: {
        institutionName: body.institutionName?.trim() ?? '',
        delegation: body.delegation?.trim() ?? '',
      },
    })
    .returning();

  await db.insert(registrationStatusHistory).values({
    registrationId: created.id,
    previousStatus: null,
    newStatus: 'submitted',
    note: 'Registro público enviado',
  });

  return NextResponse.json(
    {
      id: created.id,
      status: created.status,
      message: 'Registro recibido. El comité organizador revisará su solicitud.',
    },
    { status: 201 },
  );
}
