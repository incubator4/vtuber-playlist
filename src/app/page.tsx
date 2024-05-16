import { Snippet } from "@nextui-org/snippet";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="mt-8">
        <Snippet hideSymbol hideCopyButton variant="flat">
          <span>
            <p>Copyright by Incubator4</p>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
