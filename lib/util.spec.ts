import { tryCatchV2 } from "./util";

const d = tryCatchV2(async () => {
  return 2;
});
d.then((v) => {
  if (!v.hasError) {
    v.data.toExponential();
  } else {
    //@ts-expect-error
    v.data?.toExponential();
  }
});

const d2 = tryCatchV2(() => {
  return 2;
});
//@ts-expect-error
d2.then;

//@ts-expect-error
d2.data.toExponential();

if (!d2.hasError) {
  d2.data.toExponential();
}
