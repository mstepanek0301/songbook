#include <stdio.h>

typedef struct {
	unsigned char red;
	unsigned char green;
	unsigned char blue;
} Color;

Color ColorAdd(Color a, Color b) {
	Color result = {a.red + b.red, a.green + b.green, a.blue + b.blue};
	return result;
}

Color ColorMultiply(Color a, float k) {
	Color result =  {
		(unsigned char)(a.red * k),
		(unsigned char)(a.green * k),
		(unsigned char)(a.blue * k),
	};
	return result;
}

Color ColorMix(Color base, Color overlay, float opacity) {
	Color result = ColorAdd(
		ColorMultiply(base, 1.0 - opacity),
		ColorMultiply(overlay, opacity)
	);
	return result;
}

void printNamedColor(char *name, Color color) {
	printf("%s: #%02x%02x%02x\n", name, color.red, color.green, color.blue);
}

int main() {
	Color white = {255, 255, 255};
	Color black = {0, 0, 0};
	Color accent = {240, 100, 20};

	Color light = ColorMix(white, accent, 0.2);
	Color dark = ColorMix(black, accent, 0.2);
	Color accentLight = ColorMix(white, accent, 0.4);
	Color accentLightHover = ColorMix(accentLight, dark, 0.05);
	Color gray = ColorMix(light, dark, 0.5);

	printNamedColor("light", light);
	printNamedColor("dark", dark);
	printNamedColor("accentLight", accentLight);
	printNamedColor("accent", accent);
	printNamedColor("accentLightHover", accentLightHover);
	printNamedColor("gray", gray);
	return 0;
}