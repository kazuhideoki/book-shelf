import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {
  code?: string;
  // authResponse?: AuthResponse;
}

const Settings: NextPage<P> = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/api/drive/token`);
  }, []);

  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query?.code as string;

  return { props: { code } };
};

export default Settings;
