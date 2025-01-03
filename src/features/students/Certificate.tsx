import { Link, useSearchParams } from "react-router-dom";
import { TopNav } from "./TopNav";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import FileSaver from "file-saver";
import { useStudentCohort } from "utils";
import { ExpandedSpinner } from "components/Spinner";
import { useState } from "react";
import { Ellipsis } from "react-css-spinners";

export function Certificate() {
  const { data: cohort, isLoading } = useStudentCohort();
  let programName = cohort?.program?.name ?? "";
  programName = programName.trim();

  const [params] = useSearchParams();
  let firstName = params.get("firstName") ?? "";
  let lastName = params.get("lastName") ?? "";
  let fullName = firstName.trim() + " " + lastName.trim();
  fullName = fullName.trim();

  const [uploading, setUploading] = useState(false);

  if (isLoading)
    //
    return <ExpandedSpinner flex />;

  return (
    <main className='pb-32 w-screen overflow-x-hidden'>
      <div className='flex items-center justify-between px-8'>
        <Link to='/s' className='shrink-0'>
          <img src='/logo-name.png' className='relative top-5 h-28 w-28' />
        </Link>
        <TopNav />
      </div>
      <section className='relative mt-10 flex flex-1 justify-center p-4 xl:mt-4'>
        <div className='flex w-[800px] flex-col gap-y-10'>
          <h1 className='text-4xl font-bold text-[#193A32] md:text-3xl'>
            Your Certificate is ready to be downloaded!
          </h1>
          <div className='flex flex-col gap-y-1'>
            <img src='/third/Certificate_img.png' className='w-full' />
            <div className='mt-6 flex justify-center'>
              <button
                onClick={async () => {
                  setUploading(true);
                  try {
                    await generateCertificate(fullName, programName);
                  } finally {
                    setUploading(false);
                  }
                }}
                type='button'
                className='w-button'
                disabled={uploading}
              >
                {uploading ? <Ellipsis size={20} /> : "Download Certificate"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

async function generateCertificate(name: string, programName: string) {
  const templateUrl = "/cert/slate.pdf";
  const templateBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  let page = pdfDoc.getPage(0);

  await paintName(pdfDoc, page, name);
  await paintDate(pdfDoc, page, new Date());
  await paintProgramName(pdfDoc, page, programName);

  const generated = await pdfDoc.save();

  let blob = new Blob([generated.buffer], {
    type: "application/pdf"
  });
  FileSaver.saveAs(blob, "Certificate.pdf");
  /*
  {
    const dataUrl = URL.createObjectURL(blob);
    const tab = window.open();
    if (tab) tab.location.href = dataUrl;
    URL.revokeObjectURL(dataUrl);
  }
  */
}

async function paintName(pdfDoc: PDFDocument, page: PDFPage, name: string) {
  const FONT_SIZE = 40;
  const ORIGIN_X = 510;

  const font = await pdfDoc.embedFont(
    await fetch("/cert/font-name.ttf").then(res => res.arrayBuffer())
  );

  let text = name.toUpperCase();
  let textWidth = font.widthOfTextAtSize(text, FONT_SIZE);
  let halfWidth = textWidth / 2;
  let left = ORIGIN_X - halfWidth;

  page.drawText(text, {
    x: left,
    y: 300,
    size: FONT_SIZE,
    font: font,
    color: rgb(0.772, 0.607, 0.274)
  });
}

async function paintDate(pdfDoc: PDFDocument, page: PDFPage, date: Date) {
  const yyyy = date.getFullYear();
  let mm: any = date.getMonth() + 1; // Months start at 0!
  let dd: any = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const dateStr = dd + "-" + mm + "-" + yyyy;

  const font = await pdfDoc.embedFont(
    await fetch("/cert/font-date.ttf").then(res => res.arrayBuffer())
  );

  page.drawText(dateStr, {
    x: 580,
    y: 180,
    size: 16,
    font: font,
    color: rgb(0, 0, 0)
  });
}

async function paintProgramName(
  pdfDoc: PDFDocument,
  page: PDFPage,
  programName: string
) {
  const font = await pdfDoc.embedFont(
    await fetch("/cert/font-date.ttf").then(res => res.arrayBuffer())
  );

  const ORIGIN_X = 510;
  const FONT_SIZE = 16;

  let textWidth = font.widthOfTextAtSize(programName, FONT_SIZE);
  let left = ORIGIN_X - textWidth / 2;

  page.drawText(programName, {
    x: left,
    y: 225,
    size: FONT_SIZE,
    font: font,
    color: rgb(0.0941, 0.3215, 0.2196)
    // #185238
  });
}
