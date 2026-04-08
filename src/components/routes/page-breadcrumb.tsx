import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { camelCaseToTitleCase } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import * as React from "react";

const PageBreadcrumb = () => {
  const { pathname } = useLocation();

  const pathParts = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={(props) => (
              <Link to="/" {...props}>
                Nanogram
              </Link>
            )}
          />
        </BreadcrumbItem>
        {pathParts.length > 0 && <BreadcrumbSeparator />}
        {pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1;
          const href = `/${pathParts.slice(0, index + 1).join("/")}`;
          const label = camelCaseToTitleCase(part);

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={(props) => (
                      <Link to={href} {...props}>
                        {label}
                      </Link>
                    )}
                  />
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
