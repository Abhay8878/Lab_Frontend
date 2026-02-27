import strings from "../../../language";
import { useLanguage } from "../../../language/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface iMaterial {
  id: number;
  order_id: string;
  material_key: string;
  material_value: string;
}

interface iRequirInfoProp {
  shade?: string;
  tooth_numbers?: string[];
  materials?: iMaterial[];
}

export default function Requirments_info({
  shade,
  tooth_numbers,
  materials,
}: iRequirInfoProp) {
  const substructure = materials?.find(
    (m) => m.material_key === "substructure",
  )?.material_value;

  const finish = materials?.find(
    (m) => m.material_key === "finish",
  )?.material_value;

  const number_of_stages = materials?.find(
    (m) => m.material_key === "number_of_stages",
  )?.material_value;

  const material = materials?.find(
    (m) => m.material_key === "material",
  )?.material_value;
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <Card
      className="
        h-full border-1 border-[#BABABA]
        shadow-sm 
      "
    >
      <CardHeader>
        <CardTitle
          className="
            text-sm font-semibold uppercase
            text-gray-800 dark:text-gray-400
          "
        >
          <div className="flex flex-1 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-5 w-5"
            >
              <path d="M192 112L304 112L304 200C304 239.8 336.2 272 376 272L464 272L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 128C176 119.2 183.2 112 192 112zM352 131.9L444.1 224L376 224C362.7 224 352 213.3 352 200L352 131.9zM192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 250.5C512 233.5 505.3 217.2 493.3 205.2L370.7 82.7C358.7 70.7 342.5 64 325.5 64L192 64zM248 320C234.7 320 224 330.7 224 344C224 357.3 234.7 368 248 368L392 368C405.3 368 416 357.3 416 344C416 330.7 405.3 320 392 320L248 320zM248 416C234.7 416 224 426.7 224 440C224 453.3 234.7 464 248 464L392 464C405.3 464 416 453.3 416 440C416 426.7 405.3 416 392 416L248 416z" />
            </svg>
            <p>{t.orderReqSheet.card2.title}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {shade && (
          <div>
            <div className="flex flex-1 gap-2">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-4 w-4"
              >
                <path d="M576 320C576 320.9 576 321.8 576 322.7C575.6 359.2 542.4 384 505.9 384L408 384C381.5 384 360 405.5 360 432C360 435.4 360.4 438.7 361 441.9C363.1 452.1 367.5 461.9 371.8 471.8C377.9 485.6 383.9 499.3 383.9 513.8C383.9 545.6 362.3 574.5 330.5 575.8C327 575.9 323.5 576 319.9 576C178.5 576 63.9 461.4 63.9 320C63.9 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320zM192 352C192 334.3 177.7 320 160 320C142.3 320 128 334.3 128 352C128 369.7 142.3 384 160 384C177.7 384 192 369.7 192 352zM192 256C209.7 256 224 241.7 224 224C224 206.3 209.7 192 192 192C174.3 192 160 206.3 160 224C160 241.7 174.3 256 192 256zM352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160zM448 256C465.7 256 480 241.7 480 224C480 206.3 465.7 192 448 192C430.3 192 416 206.3 416 224C416 241.7 430.3 256 448 256z" />
              </svg> */}
              <p className="font-medium text-gray-700 ">
                {t.orderReqSheet.card2.h1}
              </p>
            </div>
            <div className="flex ">
              <p className="text-gray-900/80">{shade}</p>
              {/* <div className="h-3 w-3 bg-black  ml-4 mt-1"></div> */}
            </div>
          </div>
        )}

        {tooth_numbers?.length ? (
          <div>
            <div className="flex flex-1 gap-2">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-4 w-4"
              >
                <path d="M241 69.7L320 96L399 69.7C410.3 65.9 422 64 433.9 64C494.7 64 544 113.3 544 174.1L544 242.6C544 272 534.5 300.7 516.8 324.2L515.7 325.7C502.8 342.9 494.4 363.1 491.4 384.4L469.7 535.9C466.4 558.9 446.7 576 423.5 576C400.7 576 381.2 559.5 377.5 537L357.3 415.6C354.3 397.4 338.5 384 320 384C301.5 384 285.8 397.4 282.7 415.6L262.5 537C258.7 559.5 239.3 576 216.5 576C193.3 576 173.6 558.9 170.3 535.9L148.6 384.5C145.6 363.2 137.2 343 124.3 325.8L123.2 324.3C105.5 300.7 96 272.1 96 242.7L96 174.2C96 113.3 145.3 64 206.1 64C218 64 229.7 65.9 241 69.7z" />
              </svg> */}
              <p className="font-medium text-gray-700 ">
                {t.orderReqSheet.card2.h2}
              </p>
            </div>
            <p className="text-gray-900/80 ">#{tooth_numbers.join(", #")}</p>
          </div>
        ) : null}

        {substructure && (
          <div>
            <p className="font-medium text-gray-700 ">{t.orderReqSheet.card2.substructure}</p>
            <p className="text-gray-900/80 dark:text-gray-200">
              {substructure}
            </p>
          </div>
        )}

        {finish && (
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {t.orderReqSheet.card2.finish}
            </p>
            <p className="text-gray-900/80 dark:text-gray-200">{finish}</p>
          </div>
        )}

        {number_of_stages && (
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {t.orderReqSheet.card2.numberOfStages}
            </p>
            <p className="text-gray-900/80 dark:text-gray-200">
              {number_of_stages}
            </p>
          </div>
        )}

        {material && (
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {t.orderReqSheet.card2.material}
            </p>
            <p className="text-gray-900/80 dark:text-gray-200">{material}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
